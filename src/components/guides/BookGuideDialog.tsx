/**
 * BookGuideDialog
 * Lets an authenticated user book a tour guide for a date range.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Guide {
  id: string;
  name: string;
  price_per_day: number;
}

interface Props {
  guide: Guide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const today = () => new Date().toISOString().split("T")[0];

const BookGuideDialog = ({ guide, open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(today());
  const [numPeople, setNumPeople] = useState(1);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => days * Number(guide?.price_per_day ?? 0), [days, guide]);

  const handleSubmit = async () => {
    if (!guide) return;
    if (!user) {
      toast.error("Please sign in to book a guide");
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    if (days <= 0) {
      toast.error("End date must be on or after start date");
      return;
    }
    if (numPeople < 1) {
      toast.error("Number of people must be at least 1");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("guide_bookings").insert({
      user_id: user.id,
      guide_id: guide.id,
      start_date: startDate,
      end_date: endDate,
      num_people: numPeople,
      contact_phone: phone || null,
      notes: notes || null,
      total_price: totalPrice,
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to book guide");
      return;
    }
    toast.success(`Booking requested with ${guide.name}!`);
    onOpenChange(false);
    setNotes("");
    setPhone("");
    setNumPeople(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {guide?.name}</DialogTitle>
          <DialogDescription>Choose your dates and we'll send a booking request.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                min={today()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end">End date</Label>
              <Input
                id="end"
                type="date"
                min={startDate || today()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="people">Number of people</Label>
            <Input
              id="people"
              type="number"
              min={1}
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Contact phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-muted">
            <div className="text-sm">
              <div className="text-muted-foreground">{days} day(s) × ₹{Number(guide?.price_per_day ?? 0).toFixed(0)}</div>
              <div className="font-semibold text-foreground">Total</div>
            </div>
            <div className="flex items-center text-xl font-bold text-primary">
              <IndianRupee className="w-5 h-5" />
              {totalPrice.toFixed(0)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || days <= 0}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookGuideDialog;
